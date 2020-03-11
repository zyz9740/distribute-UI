from django.shortcuts import render
import logging, json
from service.models import Content
from django.http import HttpResponse


def result(request, content_id):
    try:
        c = Content.objects.get(id=content_id)
    except Content.DoesNotExist:
        logging.error('content_id:\t%d not exist.' % content_id)
        c = {'UI_element': '<div>No matching element</div>'}

    context = {'content': c.UI_element}
    return render(request, 'service/index.html', context)


def receiver(request):
    try:
        logging.info(request.POST['content'])
        val = request.POST['content']
        content = Content(UI_element=val)
        content.save()
        content_id = content.id
        logging.info("id:\t%d\tUI_element:\t%s." % (content_id, val))
    except:
        content_id = -1
        logging.error('Unhanded Error.')

    return HttpResponse(json.dumps("http://127.0.0.1:8000/service/result/%d/" % content_id), content_type='application/json')
