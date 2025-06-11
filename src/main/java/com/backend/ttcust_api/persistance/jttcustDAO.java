package com.backend.ttcust_api.persistance;
import java.sql.*;
import java.util.ArrayList;
import java.util.Scanner;

import com.backend.ttcust_api.model.ttcust;

// import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
// import com.microsoft.sqlserver.jdbc.SQLServerException;

public class jttcustDAO {
    

    private String jdbcURL = "jdbc:datadirect:openedge://192.168.12.34:15020;databaseName=tmm10";
    private String username = "sysprogress";
    private String password;
    private Connection con;

    public jttcustDAO() {
        try {
            Scanner scanner = new Scanner(System.in);

            System.out.println("Username:");
            username = scanner.nextLine();
            System.out.println("Open-Sesame-Says-What?:");
            password = scanner.nextLine();

            scanner.close();

            Class.forName ( "com.ddtek.jdbc.openedge.OpenEdgeDriver");
            con = DriverManager.getConnection ( jdbcURL, username, password );
            System.out.println("NO ERRORS THROWN WHEN TRYING TO CONNECT");

        }  catch (Exception e) {
            System.out.println("ERROR:");
            e.printStackTrace();
        }
        
    }

    public String getPassword(){
        return password;
    }

    public String loginRequest(String username){
        try{
            // jttcustDAO = new jttcustDAO();
            // password = jttcustDAO.getPassword();

            Class.forName ( "com.ddtek.jdbc.openedge.OpenEdgeDriver");
            con = DriverManager.getConnection ( jdbcURL, "sysprogress", "sysprogress" );
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

    private ttcust[] getTtcustsByMatchingX(String var, String matcher){
        try {
            String query = "";
            if (var != null) {
                query = "SELECT Customer, NAME, \"bill-to-city\", \"bill-to-state\" FROM pub.cus WHERE " + var + " = " + matcher;
            } else {
                query = "SELECT Customer, NAME, \"bill-to-city\", \"bill-to-state\" FROM pub.cus";
            }
            Statement statement = con.createStatement();
            // execute the query and get the result set
            ResultSet resultSet = statement.executeQuery(query);
            ArrayList<ttcust> ttcustArrayList = new ArrayList<>();
            while (resultSet.next()){
                String Customer = resultSet.getString("Customer");
                String NAME = resultSet.getString("NAME");
                String city = resultSet.getString("bill-to-city");
                String state = resultSet.getString("bill-to-state");
                //System.out.println("[Customer: " + Customer + ", NAME: " + NAME + ", City: " + city + ", State: " + state + "]");
                ttcustArrayList.add(new ttcust(Customer, NAME, city, state));
            }
            ttcust[] result = new ttcust[ttcustArrayList.size()];
            ttcustArrayList.toArray(result);
            return result;
        } catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

    public ttcust[] getTtcustsByName(String name){
        return getTtcustsByMatchingX("NAME", name);
    }

    public ttcust geTtcustsByID(String id){
        return getTtcustsByMatchingX("Customer", id)[0];
    }

    public ttcust[] getAllTtcusts(){
        return getTtcustsByMatchingX(null, null);
    }




}
