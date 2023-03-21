import Layout from "@/components/layout";
import { Hero, Button, Divider, Table } from 'react-daisyui'
import useGameVersion from "../useGameVersion";
import { useState } from 'react';
import useStats from "./../useStats"
import {useSession} from "next-auth/react"
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data, error, isLoading } = useGameVersion();
  const [activeTab, setActiveTab] = useState(1);

  function handleClickDev(e) {
    e.preventDefault();
    window.location.href = 'http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F'
  }

  function handleClickAlpha(e) {
    e.preventDefault();
    window.location.href = 'http://precedent-theta-tawny.vercel.app/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F'
  }

  function handleTabClick(tabNumber) {
    setActiveTab(tabNumber);
  }

  if (isLoading) return (<p>Loading...</p>)
  return (
    <>
      
      <Hero className="flex-grow ">
        <Hero.Overlay className="bg-opacity-60" />
        <Hero.Content className="text-center">
          <div className="max-w-md">
          <Image src="https://i.imgur.com/C5KKWec.png" alt="feudal logo" width="490" height="186" />
            <p className="py-6">
              This is a procedural browser-based massively multiplayer role-playing game.
            </p>

            <Button color="primary" onClick={handleClickDev}>Dev Login</Button>
            <Button color="secondary" onClick={handleClickAlpha}>Alpha Login</Button>
            <Divider />
            <div className="flex flex-col items-center">
              <div className="tabs">
                <a
                  className={`tab tab-bordered${activeTab === 1 ? " tab-active" : ""}`}
                  onClick={() => handleTabClick(1)}
                >
                  Events
                </a>
                <a
                  className={`tab tab-bordered${activeTab === 2 ? " tab-active" : ""}`}
                  onClick={() => handleTabClick(2)}
                >
                  Changelog
                </a>
                <a
                  className={`tab tab-bordered${activeTab === 3 ? " tab-active" : ""}`}
                  onClick={() => handleTabClick(3)}
                >
                  Roadmap
                </a>
              </div>
              {activeTab === 1 && (
                <div className="mt-4">
                  <p>Alpha featuring NPC combat is released!</p>
                  <p>Participants will receive the beta tester title.</p>
                  <p>Those who find and report bugs will reveive the bug title.</p>
                  <p>Report bugs to scott-#5240 on discord.</p>
                  
                </div>
              )}
              {activeTab === 2 && (
                <div className="mt-4">
                  <Table compact={true}>
                    <Table.Head>
                      <span>Id</span>
                      <span>Version</span>
                      <span>Changes</span>

                    </Table.Head>

                    <Table.Body>
                      <Table.Row>
                        <span>1</span>
                        <span>{data[0].version}</span>
                        <span>{data[0].changelog['0.03']}</span>
                      </Table.Row>
                      <Table.Row>
                        <span>2</span>
                        <span>0.02</span>
                        <span>{data[0].changelog['0.02']}</span>
                      </Table.Row>
                      <Table.Row>
                        <span>3</span>
                        <span>0.01</span>
                        <span>{data[0].changelog['0.01']}</span>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}
              {activeTab === 3 && (
                <div className="mt-4">
                  <Table compact={true}>
                    <Table.Head>
                      <span>Priority</span>
                      <span>Timeline</span>
                      <span>Features</span>

                    </Table.Head>

                    <Table.Body>
                      <Table.Row>
                        <span>Now</span>
                        <span>0.04</span>
                        <span>Diplomacy, village ownership, role-playing features</span>
                      </Table.Row>
                      <Table.Row>
                        <span>Soon</span>
                        <span>0.05</span>
                        <span>Trainable skills to facilitate economy system</span>
                      </Table.Row>
                      <Table.Row>
                        <span>Later</span>
                        <span>0.06</span>
                        <span>Economy</span>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </Hero.Content>
      </Hero>
    </>
  );
}
