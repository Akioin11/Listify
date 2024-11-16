import os
import google.generativeai as genai

API_KEY = "AIzaSyBd3rFfaIIwEkRlmQYy2Dbs2iBcgVXefW8";
genai.configure(api_key=API_KEY)

myfile = genai.upload_file("C:/Users/Aksha/Desktop/img1.jpg")
print(f"{myfile=}")

model = genai.GenerativeModel("gemini-1.5-flash")
result = model.generate_content(
    [myfile, "\n\n", "whats the material of the jeans, only mention the most probable one? a lower median price whatever is your best guess? and a 1 line amazon listing title for this"]
)
print(result.text)