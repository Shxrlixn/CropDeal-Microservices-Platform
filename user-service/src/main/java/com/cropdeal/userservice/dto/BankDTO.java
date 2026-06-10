package com.cropdeal.userservice.dto;

public class BankDTO {

    private int id;
    private int userId;
    private String accountNumber;
    private String ifscCode;
    private String bankName;

    public BankDTO(int id,
                   int userId,
                   String accountNumber,
                   String ifscCode,
                   String bankName) {

        this.id = id;
        this.userId = userId;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.bankName = bankName;
    }

    public int getId() {
        return id;
    }

    public int getUserId() {
        return userId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public String getBankName() {
        return bankName;
    }
}