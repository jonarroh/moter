import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";

type PostWithAutor = RouterOutputs["post"]["getAll"][number];
const RenderPost = (props: PostWithAutor) => {
  const { post, author } = props;

  return (
    <li
      key={post.authorId}
      className="flex flex-row items-center py-3 text-white"
    >
      <img
        src={author.profilePhotoUrl}
        alt="profile image"
        className="me-2 w-10 rounded-full"
      />
      <h2>{post.autorName}</h2>
      <p>{post.content}</p>
    </li>
  );
};

function PostList() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

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
