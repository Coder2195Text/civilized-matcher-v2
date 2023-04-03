import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Router from "next/router";
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import ActionButton from "@/components/ActionButton";
import { User } from "@prisma/client";
import { BiErrorAlt, BiHide, BiShow } from "react-icons/bi";
import { BsFillExclamationTriangleFill, BsFillTrashFill } from "react-icons/bs";
import { AuthStatus } from "@/types/next-auth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { UserData } from "@/types/prisma";
import { AGES, GENDERS, MAX_DISTANCE } from "@/globals/constants";
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

const Notice: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div className="my-8 text-2xl font-extrabold text-yellow-500">
			<BsFillExclamationTriangleFill className="inline mr-2 w-6 h-6" />
			{children}
		</div>
	);
};

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
							setForm("unset");
						}}
					>
						<BsFillTrashFill className="w-full h-full" />
					</ActionButton>
				</div>
				<hr className="my-2" />
			</div>
		);
	return null;
};

const FORM_INIT: UserData = {
	age: NaN,
	desc: "",
	gender: "",
	location: "",
	matchDesc: "",
	name: "",
	preferredAges: [],
	preferredGenders: [],
	radius: 0,
	selfieURL: null,
	poly: "",
};

interface QuestionProps {
	question: string;
	children?: ReactNode;
	name: string;
}

interface ChoiceProps extends QuestionProps {
	choices: readonly any[];
}

interface TextProps extends QuestionProps {
	placeholder: string;
}

interface SliderProps extends QuestionProps {
	min: number;
	max: number;
	step?: number;
}

const ShortAnswer: FC<TextProps> = ({
	placeholder,
	children,
	name,
	question,
}) => {
	return (
		<div>
			<label>{question}</label>
			{children && <div>{children}</div>}
			<Field id={name} name={name} placeholder={placeholder} />
			<ErrorMessage name={name} />
		</div>
	);
};

const MultipleChoice: FC<ChoiceProps> = ({
	question,
	children,
	name,
	choices,
}) => {
	return (
		<div>
			<label>{question}</label>
			{children && <div>{children}</div>}
			<div className="flex flex-wrap justify-around items-center">
				{choices.map((choice) => {
					return (
						<Button className="m-1 rounded-md bg-slate-600" key={choice}>
							<label className="choice-wrapper">
								<Field type="radio" name={name} value={String(choice)} />
								{choice}
							</label>
						</Button>
					);
				})}
			</div>
			<ErrorMessage name={name} />
		</div>
	);
};

const SelectAnswer: FC<ChoiceProps> = ({
	question,
	children,
	name,
	choices,
}) => {
	return (
		<div>
			<label>{question}</label>

			{children && <div>{children}</div>}
			<div className="flex flex-wrap justify-around items-center">
				{choices.map((choice) => {
					return (
						<Button className="m-1 rounded-md bg-slate-600" key={choice}>
							<label className="choice-wrapper">
								<Field type="checkbox" name={name} value={String(choice)} />
								{choice}
							</label>
						</Button>
					);
				})}
			</div>
			<ErrorMessage name={name} />
		</div>
	);
};

const Slider: FC<SliderProps> = ({
	question,
	children,
	name,
	max,
	min,
	step,
}) => {
	return (
		<div>
			<label>{question}</label>

			{children && <div>{children}</div>}
			<div className="flex justify-around items-center">
				{min}km
				<Field
					type="range"
					name={name}
					min={min}
					max={max}
					step={step}
					className="mx-4 px-0"
				/>
				{max}km
			</div>
			<ErrorMessage name={name} />
		</div>
	);
};

const FormEdit: FC<ChildProps> = ({ form }) => {
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
					console.log(values);
					const errors: { [key: string]: ReactNode } = {};
					if (!values.name?.length) {
						errors.name = "Your name is required.";
					} else if (values.name.length >= 500) {
						errors.name = "Your name is too long.";
					}
					if (!values.age) {
						errors.age = "Your age is required.";
					}
					if (!(values.preferredAges as any[])?.length) {
						errors.preferredAges = "You must select at least one age.";
					}

					if (!values.gender) {
						errors.gender = "Your gender is required.";
					}

					if (!(values.preferredGenders as any[])?.length) {
						errors.preferredGenders = "You must select at least one gender.";
					}

					if (!values.location?.length) {
						errors.location = "Your location is required.";
					} else if (values.location.length >= 500) {
						errors.location = "Location is too long.";
					}

					for (let error in errors) {
						errors[error] = (
							<div className="my-4 font-extrabold text-red-400">
								<BiErrorAlt className="inline w-6 h-6" /> {errors[error]}
							</div>
						);
					}
					return errors;
				}}
				onSubmit={() => {}}
			>
				<Form>
					<ShortAnswer
						question="Name:"
						name="name"
						placeholder="Your name here"
					>
						The name you want to be addressed by
					</ShortAnswer>

					<MultipleChoice question="Age:" name="age" choices={AGES} />

					<SelectAnswer
						question="Ages you can date:"
						name="preferredAges"
						choices={AGES}
					/>

					<Notice>
						Notice: For the next two questions, cis refers to same gender as
						birth sex. AMAB refers to "a male at birth", while AFAB refers to "a
						female at birth".
					</Notice>

					<MultipleChoice question="Gender:" name="gender" choices={GENDERS} />

					<SelectAnswer
						question="Genders you can date:"
						name="preferredGenders"
						choices={GENDERS}
					/>

					<Notice>
						Notice: I cannot stress this enough, but for the next question,
						people love to put invalid answers, when it's one of the important
						parts of the form. Please read the instructions, because it helps
						everyone and our matchmakers.
					</Notice>

					<ShortAnswer
						question="Location (Please read instructions):"
						name="location"
						placeholder="A location"
					>
						- Share your real-life location in the format
						[City/Town],[State/Province],[Country].
						<br />- If not comfortable, choose a location within a 50km radius
						of your real location and use the same format. This will ensure your
						privacy, due to the massive area range.
						<br />
						Incorrect submissions will be deleted as other users rely on this
						information.
					</ShortAnswer>
					<Slider
						min={0}
						max={MAX_DISTANCE}
						name="radius"
						question="Max radius for partners:"
					>
						Leave it at 0 if you want people from all around the world.
					</Slider>
				</Form>
			</Formik>
		</div>
	);
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
				{status == "authenticated" && !isLoading && form !== "unset" && (
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
