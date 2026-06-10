package com.cropdeal.userservice.dto;

public class UserDTO {

    private int id;
    private String name;
    private String email;
    private String role;
    private String password;   // ✅ add this
    private String phone;
    private String address;


    public UserDTO() {
    }


    public UserDTO(int id,
                   String name,
                   String email,
                   String role,
                   String phone,
                   String address) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.address = address;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public String getPassword() {   // ✅ add this
        return password;
    }

    public void setPassword(String password) {   // ✅ add this
        this.password = password;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}