import Layout from "@/components/Layout";
import { fetcher } from "@/globals/utils";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Router from "next/router";
import { FC, useState } from "react";
import useSWR from "swr/immutable";
import ActionButton from "@/components/ActionButton";
import { User } from "@prisma/client";
import { BiHide, BiShow } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";

const EnableStatus = ["enabled", "updating", "disabled"] as const;
type EnableStatus = (typeof EnableStatus)[number];

const Form: FC = () => {
  const { status } = useSession();
  const [enableStatus, setEnableStatus] = useState<EnableStatus>("updating");
  const [form, setForm] = useState<User | null>(null); // [form, setForm
  const { isLoading } = useSWR<User | null>(
    "/api/responses/@me",
    (input: RequestInfo | URL, init?: RequestInit | undefined) =>
      fetch(input, init)
        .then((res) => res.json())
        .then((val: User | null) => {
          setForm(val);
          if (val) setEnableStatus(val.enabled ? "enabled" : "disabled");
          return val;
        })
  );

  if (typeof window !== "undefined" && status === "unauthenticated")
    Router.push("/");
  return (
    <>
      <NextSeo
        title="Matchmaking - Dashboard"
        description="Manage your matchmaking profile and more."
      />
      <Layout>
        {status == "authenticated" && !isLoading && (
          <>
            <h1>Form Management</h1>
            {form && (
              <div>
                <h3>Actions</h3>

                <ActionButton
                  disabled={enableStatus == "updating"}
                  text={
                    enableStatus == "updating"
                      ? `${form.enabled ? "Disabling" : "Enabling"} Form...`
                      : `${
                          enableStatus == "enabled" ? "Disable" : "Enable"
                        } Form`
                  }
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                  onClick={async () => {
                    setEnableStatus("updating");
                    await fetch("/api/responses/@me/enable", {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(!form.enabled),
                    });
                    setEnableStatus(!form.enabled ? "enabled" : "disabled");
                    setForm({ ...form, enabled: !form.enabled });
                  }}
                >
                  {form.enabled ? (
                    <BiHide className="w-full h-full" />
                  ) : (
                    <BiShow className="w-full h-full" />
                  )}
                </ActionButton>
                <ActionButton
                  text="Delete Form"
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                  onClick={async () => {
                    await fetch("/api/responses/@me", {
                      method: "DELETE",
                    });
                    setForm(null);
                  }}
                >
                  <BsFillTrashFill className="w-full h-full" />
                </ActionButton>
              </div>
            )}
            <h3>{form ? "Edit" : "Create"} Form</h3>
          </>
        )}
      </Layout>
    </>
  );
};

export default Form;
