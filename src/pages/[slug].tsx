import { type NextPage } from "next";
import { useRouter } from "next/router";
import LayoutMain from "~/components/Layouts/LayoutMain";
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
      <LayoutMain>
        {data.map((post) => (
          <li
            key={post.post.id}
            className="my-1  flex w-9/12 list-none flex-row items-center border px-4 py-3 text-white"
          >
            <div className="flex flex-row items-center py-3">
              <img
                src={post.author.profilePhotoUrl}
                alt="profile image"
                className="me-2 w-10 rounded-full"
              />
              <h2 className="mx-2">{post.post.autorName}</h2>
              <p>{post.post.content}</p>
            </div>
          </li>
        ))}
      </LayoutMain>
    </>
  );
};

export default Id;
