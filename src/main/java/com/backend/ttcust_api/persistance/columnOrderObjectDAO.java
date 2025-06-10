package com.backend.ttcust_api.persistance;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

import com.backend.ttcust_api.model.columnOrderObject;

public class columnOrderObjectDAO {
    private String filename = "data/columnOrder.json";
    private Map<String, columnOrderObject> columnOrders;
    private ObjectMapper objectMapper = new ObjectMapper();
    
    public columnOrderObjectDAO(){
        try {
            load();
        } catch (Exception e){
            System.err.println("Bad file?");
            System.err.println(e);
        } 
    }

    private columnOrderObject[] getColumnOrderObjectArray(){
        return getColumnOrderObjectArray(null);
    }

    private columnOrderObject[] getColumnOrderObjectArray(String columnId) {
        ArrayList<columnOrderObject> columnOrderObjectArrayList = new ArrayList<>();
        
        for (columnOrderObject columnOrder: columnOrders.values()){
            if (columnId == null || columnOrder.getColumnId() == columnId){
                columnOrderObjectArrayList.add(columnOrder);
            }
        }

        columnOrderObject[] columnOrderObjectArray = new columnOrderObject[columnOrderObjectArrayList.size()];
        columnOrderObjectArrayList.toArray(columnOrderObjectArray);
        return columnOrderObjectArray;
    }
    private boolean save() throws IOException {
        columnOrderObject[] columnOrderObjectArray = getColumnOrderObjectArray();

        objectMapper.writeValue(new File(filename), columnOrderObjectArray);
        return true;
    }

    private boolean load() throws IOException {
        columnOrders = new TreeMap<>();

        columnOrderObject[] listColumnOrderObjects = objectMapper.readValue(new File(filename), columnOrderObject[].class);

        for (columnOrderObject columnOrder: listColumnOrderObjects) {
            columnOrders.put(columnOrder.getUserId() + "|" + columnOrder.getColumnId(), columnOrder);
        }
        return true;
    }

    //public methods
    public columnOrderObject[] getAllColumnOrderObjects(){
        synchronized(columnOrders){
            return getColumnOrderObjectArray();
        }
    }

    public columnOrderObject[] getColumnOrderByUserId(String userId){
        synchronized(columnOrders){
            ArrayList<columnOrderObject> columnOrderObjectArrayList = new ArrayList<>();
            for (columnOrderObject columnOrder: columnOrders.values()){
                if (columnOrder.getUserId() == userId){
                    columnOrderObjectArrayList.add(columnOrder);
                }
            }
            columnOrderObject[] columnOrderObjectArray = new columnOrderObject[columnOrderObjectArrayList.size()];
            columnOrderObjectArrayList.toArray(columnOrderObjectArray);
            return columnOrderObjectArray;
        }
    }

    public columnOrderObject[] getColumnOrderByColumnId(String columnId){
        synchronized(columnOrders){
            return getColumnOrderObjectArray(columnId);
        }
    }

    public columnOrderObject getColumnOrderByUserAndColumnId(String identification){
        synchronized(columnOrders){
            return columnOrders.get(identification);
        }
    }

    public columnOrderObject createColumnOrderObject(columnOrderObject col) throws IOException{
        synchronized(columnOrders){
            columnOrderObject notThere = columnOrders.get(col.getUserId() + "|" + col.getColumnId());
            if (notThere != null){
                return null;
            }
            columnOrderObject newCo = new columnOrderObject(col.getUserId(), col.getColumnId(), col.getDataColumns());
            columnOrders.put(newCo.getUserId() + "|" + newCo.getColumnId(), newCo);
            save();
            return newCo;
        }
    }

    public columnOrderObject updateColumnOrderObject(columnOrderObject col) throws IOException{
        synchronized(columnOrders){
            if (columnOrders.containsKey(col.getUserId() + "|" + col.getColumnId()) == false){
                return null;
            }
            columnOrders.put(col.getUserId()+"|"+col.getColumnId(), col);
            save();
            return col;
        }
    }
}
