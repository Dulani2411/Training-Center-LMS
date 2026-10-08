// Type declaration for mssql/msnodesqlv8 sub-path export
// The main mssql package types cover the full API; this module
// simply re-exports everything from mssql for the Windows Auth driver.
declare module "mssql/msnodesqlv8" {
  export * from "mssql";
  import mssql from "mssql";
  export default mssql;
}
