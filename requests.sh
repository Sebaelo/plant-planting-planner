#!/usr/bin/env bash

BASE_URL="http://localhost:3000/api/plants"

post_plant() {
    echo "TEST: $1"
    curl -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d "$2" \
        -w "\nHTTP %{http_code}\n\n"
}

post_plant_no_body() {
    echo "TEST: $1"
    curl -X POST "$BASE_URL" \
        -w "\nHTTP %{http_code}\n\n"
}

delete_plant() {
    echo "TEST: $1"
    curl -X DELETE "$BASE_URL/$2" \
        -w "\nHTTP %{http_code}\n\n"
}

edit_plant() {
    echo "TEST: $1"
    curl -X PUT "$BASE_URL/6" \
        -H "Content-Type: application/json" \
        -d "$2" \
        -w "\nHTTP %{http_code}\n\n"
}

test_addPlant() {
    post_plant_no_body "Testing ?? operator by not sending any data or content-type"
    post_plant "Only sending plantName" \
        '{ "plantName": "Tomat" }'
    post_plant "Sending empty plantName" \
        '{
            "plantName": "",
            "amountToPlant": 2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending empty plantName"
        }'
    post_plant "Sending whitespaces for plantName" \
        '{
            "plantName": "  ",
            "amountToPlant": 2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending whitespaces for plantName"
        }'
    post_plant "Sending number for plantName" \
        '{
            "plantName": 0,
            "amountToPlant": 2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending number for plantName"
        }'
    post_plant "Sending empty for plantingAdvice" \
        '{
            "plantName": "Sending empty for plantingAdvice",
            "amountToPlant": 2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": ""
        }'
    post_plant "Sending whitespaces for plantingAdvice" \
        '{
            "plantName": "Sending whitespaces for plantingAdvice",
            "amountToPlant": 2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "   "
        }'
    post_plant "Sending number for plantingAdvice" \
        '{
            "plantName": "Sending number for plantingAdvice",
            "amountToPlant": 2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": 1
        }'
    post_plant "Sending negative number for amountToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": -2,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending negative number for amountToPlant"
        }'
    post_plant "Sending 0 for amountToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 0,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending 0 for amountToPlant"
        }'
    post_plant "Sending float for amountToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 1.5,
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending float for amountToPlant"
        }'
    post_plant "Sending string for amountToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": "2",
            "monthToPlant": 3,
            "plantCategory": 1,
            "plantingAdvice": "Sending string for amountToPlant"
        }'
    post_plant "Sending negative number for monthToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 2,
            "monthToPlant": -1,
            "plantCategory": 1,
            "plantingAdvice": "Sending negative number for monthToPlant"
        }'
    post_plant "Sending 0 for monthToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 2,
            "monthToPlant": 0,
            "plantCategory": 1,
            "plantingAdvice": "Sending 0 for monthToPlant"
        }'
    post_plant "Sending float for monthToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 2,
            "monthToPlant": 2.5,
            "plantCategory": 1,
            "plantingAdvice": "Sending float for monthToPlant"
        }'
    post_plant "Sending number above 12 for monthToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 2,
            "monthToPlant": 13,
            "plantCategory": 1,
            "plantingAdvice": "Sending number above 12 for monthToPlant"
        }'
    post_plant "Sending string for monthToPlant" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 2,
            "monthToPlant": "10",
            "plantCategory": 1,
            "plantingAdvice": "Sending string for monthToPlant"
        }'
    post_plant "All valid inputs!" \
        '{
            "plantName": "Tomat",
            "amountToPlant": 2,
            "monthToPlant": 2,
            "plantCategory": 1,
            "plantingAdvice": "Signora, i pomoDORIIII"
        }'
}
test_addPlant

test_deletePlant() {
    delete_plant "String as ID" "abc"
    delete_plant "Non-existing ID" "100"
    delete_plant "Valid ID" "4"
    delete_plant "Repeated valid ID" "4"
}
test_deletePlant

test_editPlant() {
    edit_plant "Testing an edit" \
    '
    {
        "plantName": "Tomat",
        "amountToPlant": 2,
        "monthToPlant": 1,
        "plantingAdvice": "Hello, testing to update",
        "plantCategory": 2
    }
    '
}
test_editPlant
