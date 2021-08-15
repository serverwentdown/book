document.addEventListener('DOMContentLoaded', () => {
  var imgs = document.querySelectorAll('main img')
  for (var img of imgs) {
    if (img.src.endsWith('.svg')) {
      automaticInlineSVG(img)
    }
  }
})

function automaticInlineSVG(img) {
  fetchSource(img.src)
    .then(content => {
      var title = img.getAttribute('title')
      var element = constructSVG(content, title)
      for (var attr of ['style', 'width', 'height', 'title', 'alt', 'class']) {
        copyAttribute(attr, element, img)
      }

      img.parentElement.replaceChild(element, img)
    })
    .catch(err => {
      console.warn(err)
    })
}

var sourceCache = {}

function fetchSource(src) {
  if (src in sourceCache) {
    return sourceCache[src]
  }
  return fetch(src, {
    cache: 'force-cache',
    mode: 'same-origin',
  })
    .then(resp => {
      if (resp.ok) {
        return resp.text()
      }
      throw new Error('failed to request for image data')
    })
    .then(text => sourceCache[src] = text)
}

function constructSVG(content, title) {
  var temporary = document.createElement('span')
  temporary.innerHTML = content

  var svg = temporary.firstElementChild
  if (svg && svg.tagName != 'svg') {
    throw new Error('the provided document is not a valid SVG element')
  }

  if (title) {
    var title = document.createElement('title')
    title.innerText = title
    svg.appendChild(title)
  }

  return svg;
}

function copyAttribute(name, destination, source) {
  var value = source.getAttribute(name)
  if (value) {
    destination.setAttribute(name, value)
  }
}