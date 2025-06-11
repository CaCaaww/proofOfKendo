package com.backend.ttcust_api.model;



public class dataColumn {
    
    private String field;
    private String title;
    private int orderIndex;
    private String width;

    public dataColumn(){
        
    }
    public dataColumn(String field, String title, int orderIndex, String width){
        this.field = field;
        this.title = title;
        this.orderIndex = orderIndex;
        this. width = width;
    }

    //getters
    public String getField(){
        return field;
    }
    public String getTitle(){
        return title;
    }
    public int getOrderIndex(){
        return orderIndex;
    }
    public String getWidth(){
        return width;
    }

    //setters
    public void setField(String field){
        this.field = field;
    }
    public void setTitle(String title){
        this.title = title;
    }
    public void setOrderIndex(int orderIndex){
        this.orderIndex = orderIndex;
    }
    public void setWidth(String width){
        this.width = width;
    }

    //toString
    @Override
    public String toString(){
        return "dataColumn[field: " + field + ", title: " + title + ", orderIndex: " + orderIndex + ", width: " + width + "]";
    }
}