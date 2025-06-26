package com.backend.ttcust_api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty("customer")
    public String getCustId(){
        return custId;
    }

    @JsonProperty("Seq-pre")
    public String getSeqPre(){
        return seqPre;
    }

    @JsonProperty("Seq-num")
    public int getSeqNum(){
        return seqNum;
    }

    //setters
    @JsonProperty("Customer")
    public void setCustId(String newId){
        this.custId = newId;
    }
    
    @JsonProperty("Seq-pre")
    public void setSeqPre(String newSeqPre){
        this.seqPre = newSeqPre;
    }

    @JsonProperty("Seq-num")
    public void setSeqNum(int newSeqNum){
        this.seqNum = newSeqNum;
    }

    @Override
    public String toString(){
        return "seqData[custId= " + custId + ", seqPre= " + seqPre + ", seqNum= " + seqNum + "]";
    }
}
