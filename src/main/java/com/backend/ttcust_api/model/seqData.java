package com.backend.ttcust_api.model;

public class seqData {
    private String custId;
    private String seqPre;
    private int seqNum;

    public seqData(){
        
    }
    public seqData(String custId, String seqPre, int seqNum){
        this.custId = custId;
        this.seqPre = seqPre;
        this.seqNum = seqNum;
    }

    //getters
    public String getCustId(){
        return custId;
    }
    public String getSeqPre(){
        return seqPre;
    }
    public int getSeqNum(){
        return seqNum;
    }

    //setters
    public void setCustId(String newId){
        this.custId = newId;
    }
    public void setSeqPre(String newSeqPre){
        this.seqPre = newSeqPre;
    }
    public void setSeqNum(int newSeqNum){
        this.seqNum = newSeqNum;
    }

    @Override
    public String toString(){
        return "seqData[custId= " + custId + ", seqPre= " + seqPre + ", seqNum= " + seqNum + "]";
    }
}
