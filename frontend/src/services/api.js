// src/services/api.js
const API_BASE = 'http://localhost:8082'

function getToken() {
  return localStorage.getItem('jwt')   // wherever you keep your JWT
}

async function request(path, { method = 'GET', body, params, headers = {} } = {}) {
  // build URL with query params
  let url = `${API_BASE}${path}`
  if (params) {
    const qs = new URLSearchParams(params).toString()
    url += `?${qs}`
  }

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }
  const token = getToken()
  if (token) opts.headers['Authorization'] = `Bearer ${token}`

  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(url, opts)
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : {} } catch (e) { data = text }

  if (!res.ok) {
    const err = new Error(data.message || res.statusText)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// 🔐 AUTH & ACCOUNT MANAGEMENT
export const signup            = (user)      => request('/auth/signup',          { method:'POST', body:user })
export const login             = (creds)     => request('/auth/login',           { method:'POST', body:creds })
export const forgotPassword    = (email)     => request('/auth/forgot-password',  { method:'POST', body:{ email } })
export const resetPassword     = (token,pw)  => request('/auth/reset-password',   { method:'POST', body:{ token, newPassword: pw } })

// 👤 USER PROFILE & SETTINGS
export const getProfile        = ()          => request('/user/profile')
export const updateProfile     = (data)      => request('/user/update',           { method:'PUT',  body:data })
export const getSettings       = ()          => request('/user/settings')
export const updateSettings    = (prefs)     => request('/user/settings',         { method:'PUT',  body:prefs })
export const deleteAccount     = (confirm)   => request('/user/delete',           { method:'DELETE', body:{ confirm } })

// 📝 POST & THREAD SYSTEM
export const createPost        = (content)   => request('/posts/create',          { method:'POST', body:{ content } })
export const replyPost         = (postId,content) => request(`/posts/${postId}/reply`, { method:'POST', body:{ content } })
export const getGroupPosts     = (flat=true) => request('/posts/group',         { params:{ flat } })
export const deletePost        = (postId)    => request(`/posts/${postId}/delete`, { method:'DELETE' })
export const getMyHistory      = ()          => request('/posts/my-history')
export const getMyPosts        = (limit=10,page=1) => request('/posts/mine', { params:{ limit, page }})
export const getRecentPosts    = ()          => request('/posts/recent')

// ❤️ VOTE SYSTEM
export const votePost          = (postId,type) => request(`/posts/${postId}/vote`, { method:'POST', body:{ type } })
export const removeVote        = (postId)      => request(`/posts/${postId}/vote`, { method:'DELETE' })

// 📊 DASHBOARD
export const getGroupLeaderboard = ()        => request('/dashboard/group-leaderboard')
export const getMyRank           = ()        => request('/dashboard/my-rank')
export const getLeaderboard      = ()        => request('/posts/leaderboard')

// 🧰 ADMIN (optional)
export const reportPost        = (postId)    => request(`/admin/${postId}`,      { method:'POST' })
export const getReports        = ()          => request('/admin/reports')

// convenience: logout
export function logout() {
  localStorage.removeItem('jwt')
}
