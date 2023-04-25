import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";

type PostWithAutor = RouterOutputs["post"]["getAll"][number];
const RenderPost = (props: PostWithAutor) => {
  const { post } = props;
  return (
    <li key={post.authorId}>
      <h2>{post.autorName}</h2>
      <p>{post.content}</p>
    </li>
  );
};

function PostList() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;
  return (
    <>
      <ul>
        {data.map((fullPost) => (
          <RenderPost {...fullPost} key={fullPost.post.id} />
        ))}
      </ul>
    </>
  );
}

export default PostList;
