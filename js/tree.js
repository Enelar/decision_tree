function GetParentNodes( element )
{
  var id = element.attr('id');
  var ret =
    element
      .parent()
      .find('[link_true="'+ id +'"],[link_false="'+ id +'"]');
  return;
}