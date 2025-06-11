package com.backend.ttcust_api.persistance;

import java.sql.*;
import java.util.ArrayList;

import com.backend.ttcust_api.model.ttcust;

//NOT USED TO BE TERMINATED

public class loginDAO {
    private String jdbcURL = "jdbc:datadirect:openedge://192.168.12.34:15020;databaseName=tmm10";
    private String username = "sysprogress";
    private String password;
    private jttcustDAO jttcustDAO;
    private Connection con;

    public loginDAO(){
        
    }

    public String loginRequest(String username){
        try{
            // jttcustDAO = new jttcustDAO();
            // password = jttcustDAO.getPassword();

            Class.forName ( "com.ddtek.jdbc.openedge.OpenEdgeDriver");
            con = DriverManager.getConnection ( jdbcURL, "sysprogress", password );
            //System.out.println("NO ERRORS THROWN WHEN TRYING TO CONNECT");

            String query = "SELECT \"user-id\" FROM pub.usr WHERE \"user-name\" = \'" + username + "\'";
            Statement statement = con.createStatement();
            // execute the query and get the result set
            ResultSet resultSet = statement.executeQuery(query);
            ArrayList<String> usernameArrayList = new ArrayList<>();
            while (resultSet.next()){
                String userId = resultSet.getString("User-id");
                usernameArrayList.add(userId);
            }
            return usernameArrayList.get(0);
        } catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

}
