import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Router from "next/router";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import ActionButton from "@/components/ActionButton";
import { User } from "@prisma/client";
import { BiErrorAlt, BiHide, BiShow } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { AuthStatus } from "@/types/next-auth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { UserData } from "@/types/prisma";
import { AGES, GENDERS } from "@/globals/constants";
import { Button } from "@material-tailwind/react";

const EnableStatus = ["enabled", "updating", "disabled"] as const;
type EnableStatus = (typeof EnableStatus)[number];

interface ChildProps {
  status: AuthStatus;
  form: User | null;
  setForm: Dispatch<SetStateAction<User | null | "unset">>;
  isLoading: boolean;
  enableStatus: EnableStatus;
  setEnableStatus: Dispatch<SetStateAction<EnableStatus>>;
}

const FormActions: FC<ChildProps> = ({
  form,
  setForm,
  setEnableStatus,
  enableStatus,
}) => {
  if (form)
    return (
      <div>
        <h3>Actions</h3>
        <div>
          <ActionButton
            disabled={enableStatus == "updating"}
            text={
              enableStatus == "updating"
                ? `${form.enabled ? "Disabling" : "Enabling"} Form...`
                : `${enableStatus == "enabled" ? "Disable" : "Enable"} Form`
            }
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
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
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
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
      </div>
    );
  return null;
};

const FORM_INIT: UserData = {
  age: NaN,
  desc: "",
  gender: GENDERS[0],
  location: "",
  matchDesc: "",
  name: "",
  preferredAges: [],
  preferredGenders: [],
  radius: 0,
  selfieURL: null,
};

const FormEdit: FC<ChildProps> = ({ status, form, setForm, isLoading }) => {
  if (form)
    return (
      <div>
        <h3>{form ? "Edit" : "Create"} Form</h3>
        <Formik
          initialValues={
            form
              ? {
                ...form,
                preferredAges: (form.preferredAges as any[]).map((age) =>
                  String(age)
                ),
                age: String(form.age),
              }
              : FORM_INIT
          }
          validate={(values) => {
            const errors: { [key: string]: ReactNode } = {};
            if (!values.name?.length) {
              errors.name = "Your name is required.";
            }
            if (values.name?.length >= 200) {
              errors.name = "Your name is too long.";
            }
            if (!values.age) {
              errors.age = "Your age is required.";
            }
            if (!(values.preferredAges as any[])?.length) {
              errors.preferredAges = "You must select at least one age.";
            }

            for (let error in errors) {
              errors[error] = (
                <div className="text-red-500">
                  <BiErrorAlt className="inline w-6 h-6" /> {errors[error]}
                </div>
              );
            }
            return errors;
          }}
          onSubmit={() => { }}
        >
          <Form>
            <label htmlFor="name">Name:</label>
            <Field id="name" name="name" placeholder="Preferred Name Here" />
            <br />

            <ErrorMessage name="name" />

            <label htmlFor="age">Age:</label>
            {AGES.map((age) => {
              return (
                <Button className="m-1 rounded-md bg-slate-600" key={age}>
                  <label className="choice-wrapper">
                    <Field type="radio" name="age" value={String(age)} />
                    {age}
                  </label>
                </Button>
              );
            })}
            <br />

            <ErrorMessage name="age" />

            <label htmlFor="preferredAges">Ages you can date:</label>
            {AGES.map((age) => {
              return (
                <Button className="m-1 rounded-md bg-slate-600" key={age}>
                  <label className="choice-wrapper">
                    <Field
                      type="checkbox"
                      name="preferredAges"
                      value={String(age)}
                    />
                    {age}
                  </label>
                </Button>
              );
            })}
            <br />

            <ErrorMessage name="preferredAges" />
          </Form>
        </Formik>
      </div>
    );
  return null;
};

const FormManagement: FC = () => {
  const { status } = useSession();
  const [form, setForm] = useState<User | null | "unset">("unset"); // [form, setForm
  const [enableStatus, setEnableStatus] = useState<EnableStatus>("updating");
  const [isLoading, setIsLoading] = useState(false); // [isLoading, setIsLoading

  if (!isLoading && form == "unset") {
    setIsLoading(true);
    fetch("/api/responses/@me")
      .then((res) => res.json())
      .then((val: User | null) => {
        setForm(val);
        if (val) setEnableStatus(val.enabled ? "enabled" : "disabled");
        setIsLoading(false);
      });
  }

  if (typeof window !== "undefined" && status === "unauthenticated")
    Router.push("/");
  return (
    <>
      <NextSeo
        title="Matchmaking - Form"
        description="Manage your matchmaking form and responses."
      />
      <Layout>
        {status == "authenticated" &&
          !isLoading &&
          form !== "unset" &&
          form && (
            <>
              <h1>Form Management</h1>
              <FormActions
                status={status}
                form={form}
                setForm={setForm}
                isLoading={isLoading}
                enableStatus={enableStatus}
                setEnableStatus={setEnableStatus}
              />
              <hr className="my-2" />
              <FormEdit
                status={status}
                form={form}
                setForm={setForm}
                isLoading={isLoading}
                enableStatus={enableStatus}
                setEnableStatus={setEnableStatus}
              />
            </>
          )}
      </Layout>
    </>
  );
};

export default FormManagement;
