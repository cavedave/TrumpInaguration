var data = [
  {"year": (1960),    "birth": 52.47528009},
{"year": (1961),    "birth": 52.98137539},
{"year": (1962),    "birth": 53.40489046},
{"year": (1963),    "birth": 53.93637659},
{"year": (1964),    "birth": 54.6140497},
{"year": (1965),    "birth": 55.28165922},
{"year": (1966),    "birth": 56.02127758},
{"year": (1967),    "birth": 56.73456494},
{"year": (1968),    "birth": 57.34157391},
{"year": (1969),    "birth": 57.95723079},
{"year": (1970),    "birth": 58.55078623},
{"year": (1971),    "birth": 59.07932978},
{"year": (1972),    "birth": 59.56773863},
{"year": (1973),    "birth": 60.01706328},
{"year": (1974),    "birth": 60.51154354},
{"year": (1975),    "birth": 60.95637995},
{"year": (1976),    "birth": 61.37601255},
{"year": (1977),    "birth": 61.7970686},
{"year": (1978),    "birth": 62.1564156},
{"year": (1979),    "birth": 62.51627584},
{"year": (1980),    "birth": 62.80066658},
{"year": (1981),    "birth": 63.13936818},
{"year": (1982),    "birth": 63.4612294},
{"year": (1983),    "birth": 63.70527104},
{"year": (1984),    "birth": 63.96572612},
{"year": (1985),    "birth": 64.21796425},
{"year": (1986),    "birth": 64.51506951},
{"year": (1987),    "birth": 64.76685396},
{"year": (1988),    "birth": 64.97198001},
{"year": (1989),    "birth": 65.1906102},
{"year": (1990),    "birth": 65.38618244},
{"year": (1991),    "birth": 65.57453865},
{"year": (1992),    "birth": 65.73897641},
{"year": (1993),    "birth": 65.86410597},
{"year": (1994),    "birth": 66.07246693},
{"year": (1995),    "birth": 66.2831125},
{"year": (1996),    "birth": 66.56463623},
{"year": (1997),    "birth": 66.85742234},
{"year": (1998),    "birth": 67.10105222},
{"year": (1999),    "birth": 67.33881053},
{"year": (2000),    "birth": 67.60603799},
{"year": (2001),    "birth": 67.90283114},
{"year": (2002),    "birth": 68.15844116},
{"year": (2003),    "birth": 68.42298033},
{"year": (2004),    "birth": 68.75235684},
{"year": (2005),    "birth": 69.01343231},
{"year": (2006),    "birth": 69.33907097},
{"year": (2007),    "birth": 69.64185427},
{"year": (2008),    "birth": 69.91471415},
{"year": (2009),    "birth": 70.22035204},
{"year": (2010),    "birth": 70.48546525},
{"year": (2011),    "birth": 70.76491799},
{"year": (2012),    "birth": 71.00497751},
{"year": (2013),    "birth": 71.24325217},
{"year": (2014),    "birth": 71.45499816}
]

var ƒ = d3.f

var sel = d3.select('body').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: sel.node().offsetWidth, 
  height: 400, 
  margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.x.domain([1960, 2014])
c.y.domain([40, 80])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d => d)

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('birth', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('birth', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(1990) - 2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path.your-line')

c.drawAxis()

yourData = data
  .map(function(d){ return {year: d.year, birth: d.birth, defined: 0} })
  .filter(function(d){
    if (d.year == 1990) d.defined = true
    return d.year >= 1990
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    var year = clamp(1991, 2015, c.x.invert(pos[0]))
    var birth = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.birth = birth
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2015))
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }