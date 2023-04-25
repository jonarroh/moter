import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { Button, Navbar } from "flowbite-react";

/* eslint-disable @next/next/no-img-element */
interface NavProps {
  profileImageUrl: string | undefined;
  isSignedIn: boolean | undefined;
}

function Nav({ profileImageUrl, isSignedIn }: NavProps) {
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand to="/navbars">
        <span className="self-center whitespace-nowrap pe-3 text-xl font-semibold dark:text-white">
          Moter
        </span>

        {isSignedIn && (
          <>
            <div>
              {profileImageUrl && (
                <img
                  src={profileImageUrl}
                  alt="profile"
                  className="h-10 w-10 rounded-full "
                />
              )}
            </div>
          </>
        )}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {isSignedIn ? (
          <SignOutButton>
            <Button color="purple">Logout</Button>
          </SignOutButton>
        ) : (
          <SignInButton mode="modal">
            <Button color="purple">Login</Button>
          </SignInButton>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Nav;
