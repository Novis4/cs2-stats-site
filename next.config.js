module.exports = {
  images:{
    remotePatterns:[
      { protocol:'https', hostname:'i.pinimg.com', pathname:'/**' },
      { protocol:'https', hostname:'i.imgur.com', pathname:'/**' },
      { protocol:'https', hostname:'*.supabase.co', pathname:'/storage/**' },
    ]
  }
};
