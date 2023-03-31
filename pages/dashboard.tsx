import React, { FC, MouseEventHandler, ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Router from "next/router";
import { NextSeo } from "next-seo";
import { Button } from "@material-tailwind/react";
import useSWR from "swr";
import { BsPencilSquare } from "react-icons/bs";

const ActionButton: FC<{
	text: ReactNode;
	children?: ReactNode;
	onClick: MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick, text, children }) => {
	return (
		<Button
			variant="text"
			color="blue-gray"
			className="items-start p-3 text-2xl text-black bg-pink-300 rounded-md inline-block hover:bg-pink-500 transition-all"
			onClick={onClick}
		>
			{text}
			{children && (
				<>
					<hr className="my-3" />
					{children}
				</>
			)}
		</Button>
	);
};

const Home: FC = () => {
	const { data: session, status } = useSession();

	if (typeof window !== "undefined" && status === "unauthenticated")
		Router.push("/");
	return (
		<>
			<NextSeo
				title="Matchmaking - Dashboard"
				description="Manage your matchmaking profile and more."
			/>
			<Layout>
				{status == "authenticated" && (
					<>
						<h1>
							Welcome back, {session.user.username}#{session.user.discriminator}
						</h1>
						<h3>Actions</h3>
						<ActionButton
							text="Manage your form"
							onClick={() => {
								Router.push("/form");
							}}
						>
							<BsPencilSquare className="w-full h-full" />
						</ActionButton>
					</>
				)}
			</Layout>
		</>
	);
};

export default Home;
