package commands

import (
	"fmt"

	"github.com/pkg/errors"
	"github.com/spf13/cobra"

	cmn "github.com/XuanMaoSecLab/DolphinChain/libs/common"
	"github.com/XuanMaoSecLab/DolphinChain/privval"
)

// ShowValidatorCmd adds capabilities for showing the validator info.
var ShowValidatorCmd = &cobra.Command{
	Use:   "show_validator",
	Short: "Show this node's validator info",
	RunE:  showValidator,
}

func showValidator(cmd *cobra.Command, args []string) error {
	keyFilePath := config.PrivValidatorKeyFile()
	if !cmn.FileExists(keyFilePath) {
		return fmt.Errorf("private validator file %s does not exist", keyFilePath)
	}

	pv := privval.LoadFilePV(keyFilePath, config.PrivValidatorStateFile())
	bz, err := cdc.MarshalJSON(pv.GetPubKey())
	if err != nil {
		return errors.Wrap(err, "failed to marshal private validator pubkey")
	}

	fmt.Println(string(bz))
	return nil
}
