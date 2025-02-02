package edu.uvu.ms.cybersecurity;

public class Command {

    private Object cmd;
    public Command(Object cmd){
        this.cmd = cmd;
    }

    public void print(){
        System.out.println("OGNL recieved cmd: "+this.cmd);
    }

    public void print(String loc){
        System.out.println("OGNL recieved cmd: "+this.cmd+" from "+loc);
    }

}
