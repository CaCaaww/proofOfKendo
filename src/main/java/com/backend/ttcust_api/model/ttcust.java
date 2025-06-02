package com.backend.ttcust_api.model;
// Author: James Allen Hansplant

import com.fasterxml.jackson.annotation.JsonProperty;

// A ttcust is a customer that is given in the ttcus-simple.json file.
public class ttcust {
    
    //these are the attributes of a ttcust. The name should explain what they are
    private String customer;
    private String NAME;
    private String billToCity; //city
    private String billToState; //state

    //general constructor
    public ttcust(){

    }

    //parameterized constructor
    public ttcust(String customer, String NAME, String billToCity, String billToState){
        this.customer = customer;
        this.NAME = NAME;
        this.billToCity = billToCity;
        this.billToState = billToState;
    }

    //getters
    @JsonProperty("customer")
    public String getTtcustID(){
        return customer;
    }

    @JsonProperty("NAME")
    public String getTtcustName(){
        return NAME;
    }

    @JsonProperty("bill-to-city")
    public String getTtcustBillToCity(){
        return billToCity;
    }

    @JsonProperty("bill-to-state")
    public String getTtcustBillToState(){
        return billToState;
    }

    //setters

    @JsonProperty("customer")
    public void setCustomer(String customer){
        this.customer = customer;
    }

    @JsonProperty("NAME")
    public void setTtcustName(String NAME){
        this.NAME = NAME;
    }

    @JsonProperty("bill-to-city")
    public void setTtcustBillToCity(String billToCity){
        this.billToCity = billToCity;
    }
    
    @JsonProperty("bill-to-state")
    public void setTtcustBillToState(String billToState){
        this.billToState = billToState;
    }

    @Override
    public String toString(){
        return "ttcust[customer=" + customer + ", name=" + NAME + 
        ", billToCity=" + billToCity + ", billToState=" + billToState + "]";
    }

}
