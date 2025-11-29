package com.multicore.crm;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class db_test_conn {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://frrhdeiffkdszxfzmysv.supabase.co:5432/postgres?sslmode=require";
        String user = "postgres";
        String password ="Esd@123...///"; // wrap special chars in quotes

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            if (conn != null) {
                System.out.println("Connected successfully!");
            } else {
                System.out.println("Failed to make connection.");
            }
        } catch (SQLException e) {
            System.out.println("Connection failed!");
            e.printStackTrace();
        }
    }
}
