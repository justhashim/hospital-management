# API Request Examples

This file contains example requests for all API endpoints using cURL and JavaScript fetch.

## Environment Setup

```bash
export API_URL="http://localhost:3000/api"
```

---

## Authentication APIs

### 1. Register User

**cURL:**
```bash
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "AdminPass123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@hospital.com',
    password: 'AdminPass123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  })
});
const data = await response.json();
console.log(data);
```

### 2. Login User

**cURL:**
```bash
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "AdminPass123!"
  }'
```

**Save tokens:**
```bash
# Extract tokens from response
export ACCESS_TOKEN="<your_access_token>"
export REFRESH_TOKEN="<your_refresh_token>"
```

### 3. Get Current User

**cURL:**
```bash
curl -X GET $API_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 4. Refresh Access Token

**cURL:**
```bash
curl -X POST $API_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

### 5. Logout

**cURL:**
```bash
curl -X POST $API_URL/auth/logout \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

---

## Patient Management APIs

### 1. Create Patient

**cURL:**
```bash
curl -X POST $API_URL/patients \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@patient.com",
    "phone": "1234567890",
    "dateOfBirth": "1985-03-15",
    "gender": "MALE",
    "address": "123 Medical Drive",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "bloodGroup": "A_POSITIVE",
    "allergies": "None",
    "medicalHistory": "Healthy patient with no prior conditions",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "9876543210"
  }'
```

**JavaScript:**
```javascript
const patient = await fetch('http://localhost:3000/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@patient.com',
    phone: '1234567890',
    dateOfBirth: '1985-03-15',
    gender: 'MALE',
    address: '123 Medical Drive',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    bloodGroup: 'A_POSITIVE',
    allergies: 'None',
    medicalHistory: 'Healthy patient',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '9876543210'
  })
});
const data = await patient.json();
```

### 2. Get All Patients (with pagination)

**cURL:**
```bash
# Basic
curl -X GET $API_URL/patients \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# With pagination
curl -X GET "$API_URL/patients?page=1&limit=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# With filters
curl -X GET "$API_URL/patients?page=1&limit=10&gender=MALE&bloodGroup=A_POSITIVE" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# With search
curl -X GET "$API_URL/patients?search=john" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 3. Get Patient by ID

**cURL:**
```bash
# Replace PATIENT_ID with actual patient ID
export PATIENT_ID="<patient_uuid>"

curl -X GET $API_URL/patients/$PATIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 4. Update Patient

**cURL:**
```bash
curl -X PUT $API_URL/patients/$PATIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9999999999",
    "address": "456 New Medical Center",
    "allergies": "Penicillin, Latex"
  }'
```

### 5. Search Patients

**cURL:**
```bash
curl -X GET "$API_URL/patients/search?q=john" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 6. Delete Patient (Soft Delete)

**cURL:**
```bash
curl -X DELETE $API_URL/patients/$PATIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 7. Permanently Delete Patient (Admin Only)

**cURL:**
```bash
curl -X DELETE $API_URL/patients/$PATIENT_ID/permanent \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Health Check APIs

### 1. Root Endpoint

**cURL:**
```bash
curl -X GET http://localhost:3000/
```

### 2. Health Check

**cURL:**
```bash
curl -X GET http://localhost:3000/health
```

---

## Complete Workflow Example

Here's a complete workflow from registration to patient management:

```bash
# 1. Register a new user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "DoctorPass123!",
    "firstName": "Dr. Sarah",
    "lastName": "Johnson",
    "role": "DOCTOR"
  }')

echo "Registration Response:"
echo $REGISTER_RESPONSE | jq '.'

# 2. Extract access token
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.tokens.accessToken')
echo "Access Token: $ACCESS_TOKEN"

# 3. Create a patient
PATIENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emily",
    "lastName": "Smith",
    "email": "emily.smith@patient.com",
    "phone": "5551234567",
    "dateOfBirth": "1992-07-20",
    "gender": "FEMALE",
    "address": "789 Health Ave",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "bloodGroup": "B_POSITIVE",
    "emergencyContactName": "Michael Smith",
    "emergencyContactPhone": "5559876543"
  }')

echo "Patient Creation Response:"
echo $PATIENT_RESPONSE | jq '.'

# 4. Extract patient ID
PATIENT_ID=$(echo $PATIENT_RESPONSE | jq -r '.data.id')
echo "Patient ID: $PATIENT_ID"

# 5. Get patient details
curl -s -X GET "http://localhost:3000/api/patients/$PATIENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

# 6. Get all patients
curl -s -X GET "http://localhost:3000/api/patients?page=1&limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
```

---

## Postman Collection

You can import this as a Postman collection:

1. Create a new Postman collection
2. Add environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (will be set after login)
   - `refresh_token`: (will be set after login)

3. Add requests for each endpoint above
4. Use `{{base_url}}` and `{{access_token}}` in your requests

---

## Error Handling Examples

### Validation Error (400)
```json
{
  "success": false,
  "message": "email: Invalid email address, password: Password must be at least 8 characters"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. Required roles: ADMIN"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Patient not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Rate Limit (429)
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```
