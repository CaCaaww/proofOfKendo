package com.backend.persistance;

import java.io.IOException;


import com.backend.model.ttcust;

public interface ttcustDAO {

    //gets all customers
    ttcust[] getTtcusts() throws IOException;

    //gets customer by a string match for name
    ttcust[] findTtcusts(String containsText) throws IOException;

    //gets customer by a string match for ID
    ttcust getTtcust(String id) throws IOException;

    //creates a new ttcust
    ttcust createTtcust(ttcust cust) throws IOException;

    //updates an existing ttcust
    ttcust updateTtcust(ttcust cust) throws IOException;

    //deletes a ttcust by matching String ID
    boolean deleteTtcust(String id) throws IOException;
}
