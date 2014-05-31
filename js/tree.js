$.fn.RotateLine = function( deg, pos )
{
  if (typeof pos == 'undefined')
    pos = '0% 0%';
  return this.each(function()
  {
    $(this).css
    ({
      'transform' : 'rotate(' + deg + 'deg)',
      '-ms-transform' : 'rotate(' + deg + 'deg)',
      'transform-origin' : pos,
      '-moz-transform' : 'rotate(' + deg + 'deg)',
      '-moz-transform-origin' : pos,
      '-webkit-transform' : 'rotate(' + deg + 'deg)',
      '-webkit-transform-origin' : pos,
      '-o-transform' : 'rotate(' + deg + 'deg)',
      '-o-transform-origin' : pos
    });
  });
}

function clone(obj)
{
  if (obj === null)
    return obj;
  if (typeof obj != "object")
    return obj;

  var copy = obj.constructor();
  for (var attr in obj)
    if (obj.hasOwnProperty(attr))
      copy[attr] = clone(obj[attr]);
  return copy;
}

function LDR(from, to, color)
{
  from = clone(from);
  to = clone(to);
  if (color == 'blue')
    from.left += 55;
  from.left += 10;
  from.top += 43; 
  if (color != 'gray')
  {
    to.left += 42;
    to.top += 3;
  }

  var obj = linedraw(from.left, from.top, to.left, to.top, color);
  
  var base_arrow = 
    $('<div></div>')
      .css
      ({
        'width' : '8px',
        'height' : '2px',
        'bottom' : '0px',
        'background-color' : color,
        'vertical-align' : 'bottom',
        'position' : 'absolute',
      });
  
  obj.append
  (
    base_arrow.clone().RotateLine(-50),
    base_arrow.clone().RotateLine(-120)
  );
  
  return obj;
}

function linedraw(ax,ay,bx,by,color)
{
 // Internet downloaded code
 /*
  if(ay > by)
  {
    var t = ax;
    ax = bx;
    bx = t;
    
    t = ay;
    ay = by;
    by = t;
  }
  */
  
  var delta = [(bx-ax), (by-ay)];
  var calc = Math.atan(-delta[0]/delta[1]);
  calc = calc * 180 / Math.PI;
  if (ay > by)
    calc = calc - 180;
  var length = Math.sqrt(delta[0]*delta[0]+delta[1]*delta[1]);
  
  color = color || 'black'
    
  var div = 
    $('<div></div>')
    .addClass('line')
    .css(
    {
      'height' : length + 'px',
      'width' : '2px',
      'background-color' : color,
      'position' : 'absolute',
      'top' :  ay + 'px',
      'left' : ax + 'px'
    })
    .RotateLine(calc);
  
  $('#desk')
    .append(div);
  
  return div;
}

function GetParentNodes( element )
{
  var id = element.attr('id');
  var ret =
    element
      .parent()
      .find('[link_true="'+ id +'"],[link_false="'+ id +'"]');
  return ret;
}

function GetParentLinks( element )
{
  var id = element.attr('id');
  var nodes = GetParentNodes(element);
  var res = [];
  
  nodes.each(function()
  {
    if ($(this).attr('link_true') == id)
      res.push($(this).attr('id') + '_true');
    else
      res.push($(this).attr('id') + '_false');
  });
  
  var ret = $();
  for (var k in res)
    ret = ret.add('#' + res[k]);
  return ret;
}

function UpdateLinks( element )
{
  var pos;
  
  function MoveChild( child )
  {
    var plinks = GetParentLinks(child);  
    pos = child.position();
    plinks.each(MoveFunctor);
  }
  
  function MoveFunctor()
  {
    var name = $(this).attr('id');
    var parts = name.split('_');
    var parent_id = parts[0];
    $('#' + name).remove();
    LDR
    (
      $('#' + parent_id).position(), 
      pos, 
      parts[1] == 'true' ? 'red' : 'blue'
    )
      .attr('id', name);  
  }
  
  MoveChild(element);
  MoveChild($('#' + $(element).attr('link_true')));
  MoveChild($('#' + $(element).attr('link_false')));

}