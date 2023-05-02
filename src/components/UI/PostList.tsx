import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

type PostWithAutor = RouterOutputs["post"]["getAll"][number];
const RenderPost = (props: PostWithAutor) => {
  const { post, author } = props;

  return (
    <li
      key={post.authorId}
      className=" my-1 flex w-9/12 flex-row items-center border border-neutral-100 px-4 py-3 text-white"
    >
      <Link href={`/@${post.autorName ?? ""}`}>
        <img
          src={author.profilePhotoUrl}
          alt="profile image"
          className="me-2 w-10 rounded-full"
        />
      </Link>
      <Link href={`/@${post.autorName ?? ""}`}>
        <h2 className="mx-2">{post.autorName}</h2>
      </Link>
      <div>
        <p>{post.content}</p>
      </div>
    </li>
  );
};

function PostList() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong</div>;
  return (
    <>
      <ul className="flex w-2/4 flex-col items-center justify-center  ">
        {data.map((fullPost) => (
          <RenderPost {...fullPost} key={fullPost.post.id} />
        ))}
      </ul>
    </>
  );
}

export default PostList;
