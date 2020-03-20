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

    context = {'subtree': c.subtree, 'css': c.css}
    return render(request, 'service/index.html', context)


def receiver(request):
    subtree = request.POST.get('subtree')
    css = request.POST.get('css')
    # logging.info(css)
    # logging.info(subtree)

    content = Content(subtree=subtree, css=css)
    content.save()
    content_id = content.id
    logging.info("id:\t%d\tUI_element:\t%s." % (content_id, subtree))

    return HttpResponse(json.dumps("http://127.0.0.1:8000/service/result/%d/" % content_id), content_type='application/json')
