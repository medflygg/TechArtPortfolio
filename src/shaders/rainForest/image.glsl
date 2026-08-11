void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = fragCoord/iResolution.xy;

    vec3 col = texture( iChannel0, p ).xyz;
  //vec3 col = texelFetch( iChannel0, ivec2(fragCoord-0.5), 0 ).xyz;

    float vig = 0.5 + 0.5*pow( 16.0*p.x*p.y*(1.0-p.x)*(1.0-p.y), 0.05 );
    col *= mix(1.0, vig, clamp(uVignette, 0.0, 1.0));

    fragColor = vec4( col, 1.0 );
}
