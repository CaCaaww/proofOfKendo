package com.backend.ttcust_api.persistance;
import java.sql.*;
import java.util.ArrayList;
import java.util.Scanner;

import com.backend.ttcust_api.model.seqData;
import com.backend.ttcust_api.model.ttcust;

// import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
// import com.microsoft.sqlserver.jdbc.SQLServerException;

public class jttcustDAO {
    

    private String jdbcURL = "jdbc:datadirect:openedge://192.168.12.35:15020;databaseName=tmm10";
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
            resultSet.close();
            statement.close();
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
            resultSet.close();
            statement.close();
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
    
    public ttcust[] getCustsBetweenIndex(String indexes){
        try {
            int divider = indexes.indexOf(",");
            if (divider == -1){
                System.out.println("BAD INPUT");
                return null;
            }
            String limit = indexes.substring(0, divider);
            String offset = indexes.substring(divider + 1);
            String query = "SELECT Customer, NAME, \"bill-to-city\", \"bill-to-state\" FROM pub.cus OFFSET " + offset + "ROWS FETCH NEXT " + limit + "ROWS ONLY" ;
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
            resultSet.close();
            statement.close();
            return result;
        } catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

    public int getNumCusts(){
        try {
            String query = "";
            query = "SELECT count(Customer) FROM pub.cus";
            Statement statement = con.createStatement();
            ResultSet result = statement.executeQuery(query);
            int num = 0;
            while (result.next()){
                num = result.getInt("count(Customer)");
            }
            result.close();
            statement.close();
            return num;

        } catch (Exception e){
            System.out.println(e);
        }
        return 0;
        

    }

    public ttcust[] getTtcustsWithSQLOptions(String options){
        try {
            String query = "SELECT Customer, NAME, \"bill-to-city\", \"bill-to-state\" FROM pub.cus " + options ;
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
            resultSet.close();
            statement.close();
            return result;
        } catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

    public seqData[] getSecData(String custId){
        try{
            String query = "";
                query = "SELECT Customer, \"seq-pre\", \"seq-num\" FROM pub.sox WHERE Customer = \'" + custId + "\'";
            Statement statement = con.createStatement();
            // execute the query and get the result set
            ResultSet resultSet = statement.executeQuery(query);
            ArrayList<seqData> seqDataArrayList = new ArrayList<>();
            while (resultSet.next()){
                String Customer = resultSet.getString("Customer");
                String seqPre = resultSet.getString("seq-pre");
                int seqNum = resultSet.getInt("seq-num");
                //System.out.println("[Customer: " + Customer + ", NAME: " + NAME + ", City: " + city + ", State: " + state + "]");
                seqDataArrayList.add(new seqData(Customer, seqPre, seqNum));
            }
            seqData[] result = new seqData[seqDataArrayList.size()];
            seqDataArrayList.toArray(result);
            resultSet.close();
            statement.close();
            return result;
        } catch (Exception e){
            System.out.println(e);
        }
        return null;
    }




}
