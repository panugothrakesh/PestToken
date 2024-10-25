const hre = require("hardhat")

async function main(){
    const PestSeed = await hre.ethers.getContractFactory('PestSeed')
    const pestSeed = await PestSeed.deploy();

    await pestSeed.waitForDeployment();

    console.log("PestSeed Deployed Successfully at : ",await pestSeed.getAddress())
}

main().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
})