import json
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings


db = settings.DB

@api_view(['GET'])
def index(request):
    result = db.sql('select * from hackathon.developer')
    return Response({'msg':'hello', 'data':result})

def hrsignup(data, file):
    name = data['name']
    email = data['email']
    password= data['password']
    company = data['company']

    searchquery = db.sql(f'select * from hackathon.hr where email= "{email}"')
    if len(searchquery) == 0:
        insertquery = db.sql(f'insert into hackathon.hr (avatar ,company, email , name , password) values("{file}","{company}", "{email}", "{name}", "{password}") ')
        return True
    else:
        return False

@api_view(['POST'])
def signuphr(request):
    data = request.POST
    file = request.FILES['avatar']
    with open(os.path.join("..\\frontend\\public\\uploads\\"+file.name), 'wb+') as destination:
        for chunk in file.chunks():  
            destination.write(chunk)
    result = hrsignup(data ,file)
    return Response({'status':1 , 'errorMessage':'', 'data':result})

def hrlogin(data):
    email = data['email']
    password= data['password']
    searchquery = db.sql(f'select hr_id , avatar , name , email from hackathon.hr where email= "{email}" and password= "{password}"')    
    if len(searchquery)>0:
        return searchquery
    else:
        return []


@api_view(['POST'])
def loginhr(request):
    data = request.POST
    result = hrlogin(data)
    return Response({'status':1 , 'errorMessage':'', 'data':result})


def devfilter(data):
    country = data['country']
    lang1 = data['lang1']
    lang2 = data['lang2']

    searchQuery = db.sql(f'''

         select * from hackathon.developer where country like "%{country}%" and (tech like "%{lang1}%"
            and tech like "%{lang2}%")
        ''')
    return searchQuery

#  select devhr.is_pinned , dev.avatar , dev.bio , dev.email, dev.name , dev.tech ,dev.hobbies, dev.country from hackathon.hr_dev_mapping as devhr full outer join hackathon.developer as dev on devhr.dev_id = dev.dev_id where devhr.hr_id = "{id}" or dev.country like "%a%"

@api_view(['POST', 'GET'])
def filterdev(request):
    
    if request.method == 'POST':
        data = json.loads(request.body)
        result = devfilter(data)
        return Response({'status':1 , 'errorMessage':'', 'data':result})
    else:
        result = db.sql(f'''
            select * from hackathon.developer 
        ''')
        return Response({'status':1 , 'errorMessage':'', 'data':result})


def devpin(data):
    dev_id = data['dev_id']
    hr_id = data['hr_id']
    is_pinned = data['is_pinned']
    print(dev_id , hr_id)
    searchQuery = db.sql(f'select * from hackathon.hr_dev_mapping where dev_id ="{dev_id}" and hr_id="{hr_id}" ')
    if len(searchQuery) > 0:
        updatePin = db.sql(f'update  hackathon.hr_dev_mapping set is_pinned="{is_pinned}" where dev_id="{dev_id}" and hr_id="{hr_id}" ')
        return False
    else:
        insertQuery = db.sql(f'insert into hackathon.hr_dev_mapping (dev_id, hr_id , is_pinned) values("{dev_id}","{hr_id}","{is_pinned}") ')
        return True
    print(searchQuery)


@api_view(['POST' , 'GET'])
def pindev(request):   
    if request.method == 'POST':
        data = json.loads(request.body)
        result = devpin(data)
        return Response({'status':1 , 'errorMessage':'', 'data':result})


def pindevsearch(data):
    name = data['name']
    hrid = data['hid']

    if len(name) == 0:
        result = db.sql(f'''
        select devhr.is_pinned , dev.dev_id, dev.avatar , dev.bio , dev.email, dev.name , dev.tech ,dev.hobbies, dev.country from hackathon.hr_dev_mapping as devhr full outer join hackathon.developer as dev on devhr.dev_id = dev.dev_id
    where devhr.hr_id="{hrid}"  and is_pinned="True"
        ''')

    else:
        result = db.sql(f'''
        select devhr.is_pinned ,dev.dev_id, dev.avatar , dev.bio , dev.email, dev.name , dev.tech ,dev.hobbies, dev.country from hackathon.hr_dev_mapping as devhr full outer join hackathon.developer as dev on devhr.dev_id = dev.dev_id
    where devhr.hr_id="{hrid}" and lower(dev.name) like "%{name}%" and is_pinned="True"
        ''')

    return result
    

def fetchpindev(hrid):
    result = db.sql(f'''
        select devhr.is_pinned , dev.dev_id, dev.avatar , dev.bio , dev.email, dev.name , dev.tech ,dev.hobbies, dev.country from hackathon.hr_dev_mapping as devhr full outer join hackathon.developer as dev on devhr.dev_id = dev.dev_id
        where devhr.hr_id="{hrid}"  and is_pinned="True"
        ''')
    return result



@api_view(['POST', 'GET'])
def searchpinddev(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        result= pindevsearch(data)
        return Response({'status':1, 'errorMessage':'', 'data':result})
    
    id = request.GET['hid']
    result = fetchpindev(id)
    return Response({'status':1, 'errorMessage':'', 'data':result})








#  result = db.sql(f'''
#             select devhr.is_pinned , dev.avatar , dev.bio , dev.email, dev.name , dev.tech ,dev.hobbies, dev.country from hackathon.hr_dev_mapping as devhr
#             full outer join hackathon.developer as dev on devhr.dev_id = dev.dev_id 
#             where devhr.hr_id="{id}" or name="%{name}%" and devhr.is_pinned='true ' 
#         ''')
#         return Response({'status':1, 'errorMessage':'', 'data':result})

    

    

