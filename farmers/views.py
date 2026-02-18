from django.shortcuts import render


def home(request):
    return render(request, 'farmers/home.html')


def stages(request):
    return render(request, 'farmers/stages.html')


def checklist(request):
    return render(request, 'farmers/checklist.html')
