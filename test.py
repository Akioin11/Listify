import os
import google.generativeai as genai

API_KEY = "AIzaSyBd3rFfaIIwEkRlmQYy2Dbs2iBcgVXefW8";
genai.configure(api_key=API_KEY)

myfile = genai.upload_file("C:/Users/Aksha/Pictures/nvidia1.png")
print(f"{myfile=}")

model = genai.GenerativeModel("gemini-1.5-flash")
result = model.generate_content(
    [myfile, "\n\n", "Can you tell me about the instruments in this photo?"]
)
print(result.text)