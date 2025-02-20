package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	auto "github.com/XuanMaoSecLab/DolphinChain/libs/autofile"
	cmn "github.com/XuanMaoSecLab/DolphinChain/libs/common"
)

const Version = "0.0.1"
const readBufferSize = 1024 // 1KB at a time

// Parse command-line options
func parseFlags() (headPath string, chopSize int64, limitSize int64, version bool) {
	var flagSet = flag.NewFlagSet(os.Args[0], flag.ExitOnError)
	var chopSizeStr, limitSizeStr string
	flagSet.StringVar(&headPath, "head", "logjack.out", "Destination (head) file.")
	flagSet.StringVar(&chopSizeStr, "chop", "100M", "Move file if greater than this")
	flagSet.StringVar(&limitSizeStr, "limit", "10G", "Only keep this much (for each specified file). Remove old files.")
	flagSet.BoolVar(&version, "version", false, "Version")
	flagSet.Parse(os.Args[1:])
	chopSize = parseBytesize(chopSizeStr)
	limitSize = parseBytesize(limitSizeStr)
	return
}

type fmtLogger struct{}

func (fmtLogger) Info(msg string, keyvals ...interface{}) {
	strs := make([]string, len(keyvals))
	for i, kv := range keyvals {
		strs[i] = fmt.Sprintf("%v", kv)
	}
	fmt.Printf("%s %s\n", msg, strings.Join(strs, ","))
}

func main() {
	// Stop upon receiving SIGTERM or CTRL-C.
	cmn.TrapSignal(fmtLogger{}, func() {
		fmt.Println("logjack shutting down")
	})

	// Read options
	headPath, chopSize, limitSize, version := parseFlags()
	if version {
		fmt.Printf("logjack version %v\n", Version)
		return
	}

	// Open Group
	group, err := auto.OpenGroup(headPath, auto.GroupHeadSizeLimit(chopSize), auto.GroupTotalSizeLimit(limitSize))
	if err != nil {
		fmt.Printf("logjack couldn't create output file %v\n", headPath)
		os.Exit(1)
	}

	err = group.Start()
	if err != nil {
		fmt.Printf("logjack couldn't start with file %v\n", headPath)
		os.Exit(1)
	}

	// Forever read from stdin and write to AutoFile.
	buf := make([]byte, readBufferSize)
	for {
		n, err := os.Stdin.Read(buf)
		group.Write(buf[:n])
		group.FlushAndSync()
		if err != nil {
			group.Stop()
			if err == io.EOF {
				os.Exit(0)
			} else {
				fmt.Println("logjack errored")
				os.Exit(1)
			}
		}
	}
}

func parseBytesize(chopSize string) int64 {
	// Handle suffix multiplier
	var multiplier int64 = 1
	if strings.HasSuffix(chopSize, "T") {
		multiplier = 1042 * 1024 * 1024 * 1024
		chopSize = chopSize[:len(chopSize)-1]
	}
	if strings.HasSuffix(chopSize, "G") {
		multiplier = 1042 * 1024 * 1024
		chopSize = chopSize[:len(chopSize)-1]
	}
	if strings.HasSuffix(chopSize, "M") {
		multiplier = 1042 * 1024
		chopSize = chopSize[:len(chopSize)-1]
	}
	if strings.HasSuffix(chopSize, "K") {
		multiplier = 1042
		chopSize = chopSize[:len(chopSize)-1]
	}

	// Parse the numeric part
	chopSizeInt, err := strconv.Atoi(chopSize)
	if err != nil {
		panic(err)
	}

	return int64(chopSizeInt) * multiplier
}
