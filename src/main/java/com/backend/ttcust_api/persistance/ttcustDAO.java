package com.backend.ttcust_api.persistance;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;


import com.backend.ttcust_api.model.ttcust;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ttcustDAO {
    private String filename = "data/ttcus-simple.json";
    ObjectMapper objectMapper = new ObjectMapper();
    Map<String, ttcust> ttcusts;

    public ttcustDAO(){
        try {
            load();
        } catch (Exception e){
            System.err.println("Bad file?");
            System.err.println(e);
        }
    }
    private ttcust[] getTtcustArray(){
        return getTtcustArray(null);
    }

    private ttcust[] getTtcustArray(String containsText) {
        ArrayList<ttcust> ttcustArrayList = new ArrayList<>();
        
        for (ttcust cust: ttcusts.values()){
            if (containsText == null || cust.getTtcustName().contains(containsText) ){
                ttcustArrayList.add(cust);
            }
        }

        ttcust[] ttcustArray = new ttcust[ttcustArrayList.size()];
        ttcustArrayList.toArray(ttcustArray);
        return ttcustArray;
    }
    private boolean save() throws IOException {
        ttcust[] ttcustArray = getTtcustArray();

        objectMapper.writeValue(new File(filename), ttcustArray);
        return true;
    }

    private boolean load() throws IOException {
        ttcusts = new TreeMap<>();

        ttcust[] listCusts = objectMapper.readValue(new File(filename), ttcust[].class);

        for (ttcust cust: listCusts) {
            ttcusts.put(cust.getTtcustID(), cust);
        }
        return true;
    }





    // public functions
    
    public ttcust[] getAllTtcusts(){
        synchronized(ttcusts) {
            return getTtcustArray();
        }
    }

    
    public ttcust[] findTtcustsByName(String containsText) {
        synchronized(ttcusts) {
            return getTtcustArray(containsText);
        }
    }

    
    public ttcust getTtcustById(String id) {
        synchronized( ttcusts) {
            if (ttcusts.containsKey(id))
                return ttcusts.get(id);
            else
                return null;
        }
    }

    
    public ttcust createTtcust(ttcust cust) throws IOException {
        synchronized(ttcusts){
            ttcust newTtcust = new ttcust(cust.getTtcustID(), cust.getTtcustName(), cust.getTtcustBillToCity(), cust.getTtcustBillToState());
            ttcusts.put(newTtcust.getTtcustID(), newTtcust);
            save();
            return newTtcust;
        }
    }

    
    public ttcust updateTtcust(ttcust cust) throws IOException {
        synchronized( ttcusts) {
            if (ttcusts.containsKey(cust.getTtcustID()) == false)
                return null;
            ttcusts.put(cust.getTtcustID(), cust);
            save();
            return cust;
        }
    }

    
    public boolean deleteTtcust(String id) throws IOException {
        synchronized(ttcusts) {
            if (ttcusts.containsKey(id)) {
                ttcusts.remove(id);
                return save();
            } else {
                return false;
            }
        }
    }
}
