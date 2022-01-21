import React, { useState } from "react";
import Header from "../../components/Header";
import { sanityClient } from "../../sanity";
import { urlFor } from "./../../sanity";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import Head from "next/head";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        // console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="font-bold">
        <Header />

        <img
          className="w-full h-80 object-cover"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />

        <article className="max-w-3xl mx-auto p-5">
          <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
          <h2 className="text-xl font-light text-gray-500 mb-3">
            {post.description}
          </h2>

          <div className="flex items-center space-x-2">
            <img
              className="h-10 w-10 rounded-full"
              src={urlFor(post.author.image).url()!}
              alt=""
            />
            <p className="font-bold text-sm">
              By <span className="text-green-600">{post.author.name}</span> -
              Published at {new Date(post._createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-10">
            <PortableText
              className="text-lg"
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1 className="text-3xl font-bold my-5" {...props} />
                ),
                h2: (props: any) => (
                  <h2 className="text-3xl font-bold my-5" {...props} />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border border-slate-900" />

        {submitted ? (
          <div
            style={{ backgroundColor: "#0A2540" }}
            className="flex flex-col p-10 my-10 text-white max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-2">
              Thank your for submitting your comment!
            </h3>
            <p>Once it has been approved, it will appear bellow!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          >
            <h3 className="text-sm text-green-600">Enjoyed this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment bellow!</h4>
            <hr className="py-3 mt-2" />

            <input
              type="hidden"
              {...register("_id")}
              name="_id"
              value={post._id}
            />

            <label className="block mb-5" htmlFor="">
              <span className="text-gray-700">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadhow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 focus:ring-2 outline-none"
                placeholder="Your Name"
                type="text"
              />
            </label>
            <label className="block mb-5" htmlFor="">
              <span className="text-gray-700">Email</span>
              <input
                {...register("email", { required: true })}
                className="shadhow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 focus:ring-2 outline-none"
                placeholder="Your email"
                type="email"
              />
            </label>
            <label className="block mb-5" htmlFor="">
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadhow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-green-600 focus:ring-2 outline-none"
                placeholder="Type your comment"
                name="comment"
                id=""
                rows={5}
              ></textarea>
            </label>
            <div className="flex flex-col p-5">
              {errors.name && (
                <span className="text-red-600">Name is required</span>
              )}
              {errors.email && (
                <span className="text-red-600">Email is required</span>
              )}
              {errors.comment && (
                <span className="text-red-600">Comment is required</span>
              )}
            </div>
            <input
              className="text-white bg-slate-900 hover:bg-gray-700 shadow-2xl font-bold py-3 px-4 rounded cursor-pointer"
              type="submit"
              value="Submit"
            />
          </form>
        )}

        <div className="flex flex-col p-10 max-w-2xl mx-auto shadow-green-600 shadow space-y-2 mb-20">
          <h3 className="text-3xl text-green-600">Comments</h3>
          <hr className="pb-2" />
          {post.comments.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className="text-green-600">{comment.name} </span>
                says: &nbsp;
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    description,
    mainImage,
    _createdAt,
    slug,
    body,
    author -> {
    name,
    image
    },
    "comments": *[_type == "comment" && post._ref == ^._id && approved == true]
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // 1 minute after, cache will be updated
  };
};
