function LDR(from, to, color)
{
  if (color == 'blue')
  {
    from.left += 60;
    to.left += 60;
  }
  from.top += 30;
  var obj = linedraw(from.left + 10, from.top + 10, to.left + 10, to.top + 10, color);
  
  obj.append
  (
    $('<div></div>')
      .css
      ({
        'width' : '10px',
        'height' : '10px',
        'margin-left' : '-5px',
        'bottom' : '-10px',
        'background-color' : color,
        'vertical-align' : 'bottom',
        'position' : 'absolute',
      })
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
      'width' : '1px',
      'background-color' : color,
      'position' : 'absolute',
      'top' :  ay + 'px',
      'left' : ax + 'px',
      'transform' : 'rotate(' + calc + 'deg)',
      '-ms-transform' : 'rotate(' + calc + 'deg)',
      'transform-origin' : '0% 0%',
      '-moz-transform' : 'rotate(' + calc + 'deg)',
      '-moz-transform-origin' : '0% 0%',
      '-webkit-transform' : 'rotate(' + calc + 'deg)',
      '-webkit-transform-origin' : '0% 0%',
      '-o-transform' : 'rotate(' + calc + 'deg)',
      '-o-transform-origin' : '0% 0%'      
    });
  
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