import { type NextPage } from "next";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/UI/LoadingSpinner";
import { api } from "~/utils/api";

const Id: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  //quitar el @ al slug
  const userName = String(slug).replace("@", "");
  const { data, isLoading } = api.post.getByPostUserNames.useQuery({
    authorName: userName,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <p>mensaje del usuario {slug}</p>
      {data.map((post) => (
        <li key={post.post.id}>
          <p>{post.post.content}</p>
        </li>
      ))}
    </>
  );
};

export default Id;
