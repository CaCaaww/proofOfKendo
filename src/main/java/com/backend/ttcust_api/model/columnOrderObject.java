package com.backend.ttcust_api.model;

import com.fasterxml.jackson.annotation.JsonProperty;


public class columnOrderObject {
    private String userId;
    private String columnId;
    private dataColumn[] dataColumns;

    public columnOrderObject(String userId, String columnId, dataColumn[] dataColumns){
        this.userId = userId;
        this.columnId = columnId;
        this.dataColumns = dataColumns;    
    }


    //getters
    public String getUserId(){
        return userId;
    }
    public dataColumn[] getDataColumns(){
        return dataColumns;
    }
    public String getColumnId(){
        return columnId;
    }

    //setters
    public void setUserId(String userId){
        this.userId = userId;
    }
    public void setDataColumns(dataColumn[] dataColumns){
        this.dataColumns = dataColumns;
    }
    public void setColumnId(String columnId){
        this.columnId = columnId;
    }

    //toString
    @Override
    public String toString(){
        int dataColumnsLength = dataColumns.length;
        String dataColumnsString = "dataColumns=[";
        for (int i = 0; i<dataColumnsLength; i++){
            dataColumnsString += dataColumns[i].toString();
            if (i != dataColumnsLength-1){
                dataColumnsString += ", ";
            }
        }
        dataColumnsString += "]";
        return "columnOrderObject[userId=" + userId + ", columnId=" + columnId + 
        ", " + dataColumnsString + "]";
    }
}
