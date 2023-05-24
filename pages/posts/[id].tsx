import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/services/api'
import styles from './PostDetails.module.scss'
import { Title } from '@/components'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface Comment {
  id: number
  name: string
  body: string
}

interface User {
  id: number
  name: string
}

export default function PostDetails() {
  const router = useRouter()
  const { id } = router.query

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [author, setAuthor] = useState<User | null>(null)

  useEffect(() => {
    if (id) {
      api
        .get(`/posts/${id}`)
        .then((response) => {
          setPost(response.data)
          api
            .get(`/users/${response.data.userId}`)
            .then((authorResponse) => {
              setAuthor(authorResponse.data)
            })
            .catch((error) => {
              console.error(error)
            })
        })
        .catch((error) => {
          console.error(error)
        })

      api
        .get(`/posts/${id}/comments`)
        .then((response) => {
          setComments(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [id])

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.postCard}>
        <Title>{post.title.toLocaleUpperCase()}</Title>
        <p>{post.body}</p>
      </div>

      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <h3 className="comment-name">{comment.name}</h3>
            <p className="comment-body">{comment.body}</p>
            {author && <p>By: {author.name}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
