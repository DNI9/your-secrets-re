import { User } from "@supabase/supabase-js";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { getLoggedInUser, requireUserAccess } from "~/sessions.server";
import { supabase } from "~/supabase";

type LoaderData = {
  user: User | null;
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  const user = data?.user?.user_metadata;
  return {
    title: `${user?.full_name ?? "Anon"} | Profile`,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserAccess(request);
  const user = await getLoggedInUser(request);
  const data: LoaderData = { user };
  return data;
};

export default function Profile() {
  const data = useLoaderData<LoaderData>();
  const user = data?.user?.user_metadata;

  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex flex-col justify-center items-center mt-36">
      <div className="w-28 h-28 bg-gray-700 p-2 mb-3 rounded-lg">
        <img
          className="rounded-lg"
          src={user.picture}
          alt={`Photo of ${user.full_name}`}
        />
      </div>
      <h1 className="text-5xl font-bold mb-2 text-center">{user.full_name}</h1>
      <p>{user.email}</p>
      <button className="mt-3" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
      <p></p>
    </div>
  );
}
