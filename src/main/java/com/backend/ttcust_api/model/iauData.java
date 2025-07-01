package com.backend.ttcust_api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class iauData {
    private String seqNum;
    private String itemCode;
    private String branch;
    private String dateActivity;

    public iauData(){

    }

    public iauData(String seqNum, String itemCode, String branch, String dateActivity){
        this.seqNum = seqNum;
        this.itemCode = itemCode;
        this.branch = branch;
        this.dateActivity = dateActivity;
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
    @JsonProperty("Date-activity")
    public String getDateActvity(){
        return dateActivity;
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
    @JsonProperty("Date-activity")
    public void setDateActivity(String dateActivity){
        this.dateActivity = dateActivity;
    }

    @Override
    public String toString(){
        return "iauData[seqNum= " + seqNum + ", itemCode= " + itemCode + ", branch= " + branch + ", dateActivity= " + dateActivity + "]";
    }

}
