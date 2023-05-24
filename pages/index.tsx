'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

import styles from './Home.module.scss'
import { Title } from '@/components'
interface Post {
  id: number
  title: string
  userId: number
}
interface User {
  id: number
  name: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api
      .get('/posts')
      .then((response) => {
        setPosts(response.data)
      })
      .catch((error) => {
        console.error(error)
      })

    api
      .get('/users')
      .then((response) => {
        setUsers(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const getAuthorName = (postId: number) => {
    const post = posts.find((post) => post.id === postId)

    if (post) {
      const user = users.find((user) => user.id === post.userId)
      if (user) {
        return user.name
      }
    }
    return ''
  }

  const getPostCountByAuthor = (userId: number) => {
    return posts.filter((post) => post.userId === userId).length
  }

  return (
    <div className={styles.container}>
      <Title>Posts 💻</Title>
      {posts.map((post) => (
        <div className={styles.postCard} key={post.id}>
          <h2>{post.title.toLocaleUpperCase()}</h2>
          <p>Author: {getAuthorName(post.id)}</p>
          <p>Posts by Author: {getPostCountByAuthor(post.userId)}</p>
          <Link href={`/posts/${post.id}`}>Read More</Link>
        </div>
      ))}
    </div>
  )
}
