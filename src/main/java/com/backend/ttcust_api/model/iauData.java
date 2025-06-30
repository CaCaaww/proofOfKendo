package com.backend.ttcust_api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class iauData {
    private String seqNum;
    private String itemCode;
    private String branch;

    public iauData(){

    }

    public iauData(String seqNum, String itemCode, String branch){
        this.seqNum = seqNum;
        this.itemCode = itemCode;
        this.branch = branch;
    }

    //getters
    @JsonProperty("Seq-num")
    public String getSeqNum(){
        return seqNum;
    }
    @JsonProperty("Item-code")
    public String getItemCode(){
        return itemCode;
    }
    @JsonProperty("Branch")
    public String getBranch(){
        return branch;
    }

    //setters
    @JsonProperty("Seq-num")
    public void setSeqNum(String seqNum){
        this.seqNum = seqNum;
    }
    @JsonProperty("Item-code")
    public void setItemCode(String itemCode){
        this.itemCode = itemCode;
    }
    @JsonProperty("Branch")
    public void setBranch(String branch){
        this.branch = branch;
    }

    @Override
    public String toString(){
        return "iauData[seqNum= " + seqNum + ", itemCode= " + itemCode + ", branch= " + branch+ "]";
    }

}
