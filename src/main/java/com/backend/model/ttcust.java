package com.backend.model;
// Author: James Allen Hansplant

// A ttcust is a customer that is given in the ttcus-simple.json file.
public class ttcust {
    
    //these are the attributes of a ttcust. The name should explain what they are
    private String customerID;
    private String customerName;
    private String billToCity; //city
    private String billToState; //state

    //general constructor
    public ttcust(){

    }

    //parameterized constructor
    public ttcust(String customerID, String customerName, String billToCity, String billToState){
        this.customerID = customerID;
        this.customerName = customerName;
        this.billToCity = billToCity;
        this.billToState = billToState;
    }

    //getters
    public String getTtcustID(){
        return customerID;
    }

    public String getTtcustName(){
        return customerName;
    }
    public String getTtcustBillToCity(){
        return billToCity;
    }
    public String getTtcustBillToState(){
        return billToState;
    }

    //setters. I have not made one for the ID because I am not certain yet if that is something that will need to be, or should be changed.
    public void setTtcustName(String customerName){
        this.customerName = customerName;
    }
    public void setTtcustBillToCity(String billToCity){
        this.billToCity = billToCity;
    }
    public void setTtcustBillToState(String billToState){
        this.billToState = billToState;
    }

    @Override
    public String toString(){
        return "ttcust[customer=" + customerID + ", name=" + customerName + 
        ", billToCity=" + billToCity + ", billToState=" + billToState + "]";
    }

}
