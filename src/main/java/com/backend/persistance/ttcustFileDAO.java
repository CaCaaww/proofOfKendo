package com.backend.persistance;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.backend.model.ttcust;
import java.util.ArrayList;
import java.util.TreeMap;
import java.util.logging.Logger;


import com.fasterxml.jackson.databind.ObjectMapper;


// Warning: the id for the ttcust objects is not bounded to be unique by this code. It requires that the ID is unique already.

@Component
public class ttcustFileDAO implements ttcustDAO {
    private static final Logger LOG = Logger.getLogger(ttcustFileDAO.class.getName());
    Map<String, ttcust> ttcusts; //Local cache of ttcust object

    private ObjectMapper objectMapper;
    private static String nextId;
    private String filename;
    private static int nextInt;

    //@Value("${ttcust.file}")
    public ttcustFileDAO(@Value("${ttcust.file}") String filename, ObjectMapper objectMapper) throws IOException {
        this.filename = filename;
        this.objectMapper = objectMapper;
        load();
    }

    /* Work in progress
    private synchronized static String nextID(String custName){
        if (custName.length() >= 3){
            String stringPart = custName.substring(0,  3);
            while (true){
                String idattempt = stringPart + nextInt();
                if (ttcusts.get(idattempt) == null)
            }
            
        } else {
            return custName += nextInt();
        }
    }
        */

    private synchronized static int nextInt(){
        return nextInt++;
    }
    

    private ttcust[] getTtcustArray(){
        return getTtcustArray(null);
    }

    private ttcust[] getTtcustArray(String containsText) {
        ArrayList<ttcust> ttcustArrayList = new ArrayList<>();

        for (ttcust cust: ttcusts.values()) {
            if (containsText == null || cust.getTtcustName().contains(containsText)){
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
        //nextId = 0;

        ttcust[] ttcustArray = objectMapper.readValue(new File(filename), ttcust[].class);

        for (ttcust cust: ttcustArray) {
            ttcusts.put(cust.getTtcustID(), cust);
            // if (cust.getTtcustID() == nextId){
            //     nextId = cust.getTtcustID();
            // }
        }
        //nextId++;
        return true;
    }

    @Override
    public ttcust[] getTtcusts(){
        synchronized(ttcusts) {
            return getTtcustArray();
        }
    }

    @Override
    public ttcust[] findTtcusts(String containsText) {
        synchronized(ttcusts) {
            return getTtcustArray(containsText);
        }
    }

    @Override
    public ttcust getTtcust(String id) {
        synchronized( ttcusts) {
            if (ttcusts.containsKey(id))
                return ttcusts.get(id);
            else
                return null;
        }
    }

    @Override
    public ttcust createTtcust(ttcust cust) throws IOException {
        synchronized(ttcusts){
            ttcust newTtcust = new ttcust(cust.getTtcustID(), cust.getTtcustName(), cust.getTtcustBillToCity(), cust.getTtcustBillToState());
            ttcusts.put(newTtcust.getTtcustID(), newTtcust);
            save();
            return newTtcust;
        }
    }

    @Override
    public ttcust updateTtcust(ttcust cust) throws IOException {
        synchronized( ttcusts) {
            if (ttcusts.containsKey(cust.getTtcustID()) == false)
                return null;
            ttcusts.put(cust.getTtcustID(), cust);
            save();
            return cust;
        }
    }

    @Override
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
