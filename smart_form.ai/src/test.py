from typing import List, Optional
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
import json
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage

#chatbot
llm = ChatOllama(model="llama3.1")

#context
requirements = "The person needs to be unemployed. The favorite color needs to be yellow or blue and its vital that his favorite meals contains something with meat."

#data
input_data = json.dumps({
    "question": "What is your favorite food?",
    "response": "Fish"
}, indent=2)

input_data2 = json.dumps({
    "question": "What is your favorite color?",
    "response": "Blue"
}, indent=2)

#output schema
class FormField(BaseModel):
    isValid: bool = Field(description="Indicates if the field is valid according to the requirements")
    explanation: str = Field(description="Explanation of the validation result")

class FormValidation(BaseModel):
    fields: List[FormField] = Field(description="List of fields with validation results")

#prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
                You are a helpful validation assistant that verifies the response in function of the given requirements and within the context of it's corresponding question.
                This means that when the requirement contains a large description, you only have to focus on the part that is relevant to the question.
                In addition to the validation check, you also need to provide a to-the-point and clear explanation of the validation result.
            """
        ),
        (
            "system",
            "The response has to be validated according to following requirements: {requirements}"
        ),
        ("human", "{input}"),
    ]
)

structured_llm = llm.with_structured_output(FormField)

chain = prompt | structured_llm
test = chain.invoke(
    {
        "requirements": "The person needs to be unemployed. The favorite color needs to be yellow or blue and its vital that his favorite meals contains something with meat.",
        "input": "A user gave as response: 'Fish' to the question 'What is your favorite food?'. Is this response valid according to the requirements?",
    }
)

print(test)




# ---------------------------------------------- Other approach ----------------------------------------------
# messages = [
#     SystemMessage(content=f"""
#         You are a helpful validation assistant. The goal is to verify if a response is following the specified requirements.
#         The question that the response is answering can be used as context to understand what the response means.
#         In addition to the validation check, you also need to provide a to the point and clear explanation of the validation result.
#         The response has to be validated according to following requirements: {requirements}
#     """),
#     # SystemMessage(content="The response has to be validated according to following requirements: {requirements}"),
#     HumanMessage(content=input_data),
# ]

# fields = [
#     {
#         "question": "What is your favorite food?",
#         "response": "Hamburger"
#     },
#     {
#         "question": "What is your favorite color?",
#         "response": "Blue"
#     },
#     {
#         "question": "Do you work?",
#         "response": "No"
#     }
# ]

# test = structured_llm.invoke(messages)

# print(test)